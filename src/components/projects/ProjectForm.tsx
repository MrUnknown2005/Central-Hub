import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { Field } from '@/components/common/Field'
import { ProjectThumb } from '@/components/projects/ProjectThumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/select-native'
import { Textarea } from '@/components/ui/textarea'
import { uploadProjectImage } from '@/data/services'
import type { NewProjectInput } from '@/data/services'
import { CATEGORY_META, STATUS_META } from '@/lib/catalog'
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  type Project,
  type ProjectCategory,
  type ProjectLink,
  type ProjectStatus,
} from '@/types'

/** Valid if it parses as an absolute http(s) URL. */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

type FieldError = 'name' | 'tagline' | 'liveUrl' | 'docsUrl' | 'image'
type Errors = Partial<Record<FieldError, string>>

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

/** The one form used to add and edit a project. Pass `initial` to edit; the
 *  parent decides what happens on save via `onSubmit` (add vs update + navigate).
 *  Image uploads happen here on submit, so the parent just receives the URL. */
export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Project
  submitLabel: string
  onSubmit: (input: NewProjectInput) => Promise<void>
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [tagline, setTagline] = useState(initial?.tagline ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<ProjectCategory>(initial?.category ?? 'web')
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? 'live')
  const [tech, setTech] = useState(initial?.tech.join(', ') ?? '')
  const [liveUrl, setLiveUrl] = useState(
    initial?.links.find((l) => l.type === 'website')?.url ?? '',
  )
  const [docsUrl, setDocsUrl] = useState(initial?.links.find((l) => l.type === 'docs')?.url ?? '')
  const [featured, setFeatured] = useState(initial?.featured ?? false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initial?.image ?? null)
  const [imageCleared, setImageCleared] = useState(false)

  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function onPickImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.type !== 'image/png') {
      setErrors((prev) => ({ ...prev, image: 'Upload a PNG image.' }))
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: 'Keep the image under 2 MB.' }))
      return
    }
    setErrors((prev) => ({ ...prev, image: undefined }))
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageCleared(false)
  }

  function clearImage() {
    setImageFile(null)
    setImagePreview(null)
    setImageCleared(true)
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Give the project a name.'
    if (!tagline.trim()) next.tagline = 'Add a one-line summary.'
    if (!liveUrl.trim()) next.liveUrl = 'Add the link people will open.'
    else if (!isValidUrl(liveUrl.trim())) next.liveUrl = 'Enter a full URL, including https://.'
    if (docsUrl.trim() && !isValidUrl(docsUrl.trim()))
      next.docsUrl = 'Enter a full URL, including https://.'
    return next
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setServerError(null)

    const found = validate()
    const nextErrors: Errors = { ...found, image: errors.image }
    setErrors(nextErrors)
    if (found.name || found.tagline || found.liveUrl || found.docsUrl || errors.image) return

    setSubmitting(true)
    try {
      // Resolve the image: upload a new file, keep the current one, or clear it.
      let image: string | null = initial?.image ?? null
      if (imageCleared) image = null
      if (imageFile) image = await uploadProjectImage(imageFile)

      const links: ProjectLink[] = [{ type: 'website', url: liveUrl.trim() }]
      if (docsUrl.trim()) links.push({ type: 'docs', url: docsUrl.trim() })

      await onSubmit({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        category,
        status,
        tech: tech
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        links,
        featured,
        image,
      })
    } catch {
      setServerError('Could not save this project. Check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" noValidate>
      <Field label="Name" htmlFor="name" error={errors.name}>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Orbit" />
      </Field>

      <Field label="Tagline" htmlFor="tagline" error={errors.tagline}>
        <Input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Event and RSVP hub for the whole club."
        />
      </Field>

      <Field label="Description" htmlFor="description" optional>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What it does and who it’s for."
          rows={4}
        />
      </Field>

      <Field
        label="Logo"
        htmlFor="image"
        optional
        error={errors.image}
        hint="A square PNG looks best. Under 2 MB."
      >
        <div className="flex items-center gap-4">
          <ProjectThumb name={name || 'Project'} image={imagePreview} className="size-14 text-lg" />
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="image"
              type="file"
              accept="image/png"
              onChange={onPickImage}
              className="block max-w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border file:border-input file:bg-transparent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-accent"
            />
            {imagePreview && (
              <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <NativeSelect
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ProjectCategory)}
          >
            {PROJECT_CATEGORIES.map((key) => (
              <option key={key} value={key}>
                {CATEGORY_META[key].label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <Field label="Status" htmlFor="status">
          <NativeSelect
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {PROJECT_STATUSES.map((key) => (
              <option key={key} value={key}>
                {STATUS_META[key].label}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <Field
        label="Tech and tools"
        htmlFor="tech"
        optional
        hint="Comma-separated, e.g. React, Supabase, Tailwind."
      >
        <Input
          id="tech"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          placeholder="React, Supabase, Tailwind"
        />
      </Field>

      <Field
        label="Live app URL"
        htmlFor="liveUrl"
        error={errors.liveUrl}
        hint="The link Quick Launch opens — the running app itself."
      >
        <Input
          id="liveUrl"
          type="url"
          inputMode="url"
          value={liveUrl}
          onChange={(e) => setLiveUrl(e.target.value)}
          placeholder="https://orbit.example.com"
        />
      </Field>

      <Field label="Docs URL" htmlFor="docsUrl" optional error={errors.docsUrl}>
        <Input
          id="docsUrl"
          type="url"
          inputMode="url"
          value={docsUrl}
          onChange={(e) => setDocsUrl(e.target.value)}
          placeholder="https://docs.example.com"
        />
      </Field>

      <label htmlFor="featured" className="flex items-start gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="mt-0.5 size-4 accent-foreground"
        />
        <span className="space-y-0.5">
          <span className="block text-sm font-medium">Feature on the dashboard</span>
          <span className="block text-xs text-muted-foreground">
            Show it in Quick Launch, up to four at a time.
          </span>
        </span>
      </label>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link to={initial ? `/projects/${initial.slug}` : '/'}>Cancel</Link>
        </Button>
      </div>
    </form>
  )
}
