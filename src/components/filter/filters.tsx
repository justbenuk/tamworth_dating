'use client'
import { Button } from "@heroui/button"
import { Select, SelectItem } from "@heroui/select"
import { Slider } from "@heroui/slider"
import { usePathname } from "next/navigation"
import { useFilters } from "@/hooks/use-filters"

export default function Filters() {
  const pathname = usePathname()
  const { genderList, orderByList, filters, selectAge, selectGender, selectOrder } = useFilters()


  if (pathname !== '/members') return null

  return (
    <div className="shadow-md py-2 bg-gray-100">
      <div className="flex flex-row justify-around items-center">
        <div className="font-semibold">Results 10</div>
        <div className="flex gap-2 items-center">
          <div>Gender:</div>
          {genderList.map(({ icon: Icon, value }) => (
            <Button
              key={value}
              size="sm"
              isIconOnly
              color={filters.gender.includes(value) ? 'secondary' : 'default'}
              onPress={() => selectGender(value)} >
              <Icon size={24} />
            </Button>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/4">
          <Slider label='Age range' color="secondary" size="sm" minValue={18} maxValue={100} defaultValue={filters.ageRange} onChangeEnd={(value) => selectAge(value as number[])} />
        </div>
        <div className="w-1/4">
          <Select size="sm" fullWidth label="Order by" variant="bordered" color="secondary" aria-label="Order by selector" selectedKeys={new Set([filters.orderBy])} onSelectionChange={selectOrder}>
            {orderByList.map(item => (
              <SelectItem key={item.value}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
