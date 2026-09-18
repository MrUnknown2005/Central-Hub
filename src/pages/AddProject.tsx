import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Field } from '@/components/common/Field'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/select-native'
import { Textarea } from '@/components/ui/textarea'
import { addProject } from '@/data/services'
import { CATEGORY_META, STATUS_META } from '@/lib/catalog'
import type { ProjectLink } from '@/types'
import { PROJECT_CATEGORIES, PROJECT_STATUSES, type ProjectCategory, type ProjectStatus } from '@/types'

/** Valid if it parses as an absolute http(s) URL. */
function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

type Errors = Partial<Record<'name' | 'tagline' | 'liveUrl' | 'docsUrl', string>>

export function AddProject() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ProjectCategory>('web')
  const [status, setStatus] = useState<ProjectStatus>('live')
  const [tech, setTech] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [docsUrl, setDocsUrl] = useState('')
  const [featured, setFeatured] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Give the project a name.'
    if (!tagline.trim()) next.tagline = 'Add a one-line summary.'
    if (!liveUrl.trim()) next.liveUrl = 'Add the link people will open.'
    else if (!isValidUrl(liveUrl.trim()))
      next.liveUrl = 'Enter a full URL, including https://.'
    if (docsUrl.trim() && !isValidUrl(docsUrl.trim()))
      next.docsUrl = 'Enter a full URL, including https://.'
    return next
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // The live URL is stored as a `website` link so Quick Launch and the detail
    // page's "open" logic work unchanged.
    const links: ProjectLink[] = [{ type: 'website', url: liveUrl.trim() }]
    if (docsUrl.trim()) links.push({ type: 'docs', url: docsUrl.trim() })

    const project = addProject({
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
    })

    navigate(`/projects/${project.slug}`)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add a project"
        description="Add a tool to the hub so members can find and open it."
      />

      <form onSubmit={onSubmit} className="max-w-2xl space-y-6" noValidate>
        <Field label="Name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Orbit"
          />
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

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" size="lg">
            Add project
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
