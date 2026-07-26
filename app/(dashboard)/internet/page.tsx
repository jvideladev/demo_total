import FilterBar from '@/components/FilterBar'
import CollapsibleGroup from '@/components/internet/CollapsibleGroup'
import { internetGroups } from '@/lib/mock-data'

export default function InternetPage() {
  return (
    <div style={{ minHeight: '80vh' }}>
      <FilterBar />
      <div className="flex flex-col gap-4 p-4">
        {internetGroups.map(group => (
          <CollapsibleGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}
