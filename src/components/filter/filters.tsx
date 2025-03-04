'use client'
import { Button } from "@heroui/button"
import { Select, SelectItem } from "@heroui/select"
import { Slider } from "@heroui/slider"
import { useFilters } from "@/hooks/use-filters"

export default function Filters() {
  const { genderList, orderByList, filters, selectAge, selectGender, selectOrder } = useFilters()



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
              className={filters.gender.includes(value) ? 'bg-red-500 text-white' : 'bg-gray-400'}
              onPress={() => selectGender(value)} >
              <Icon size={24} />
            </Button>
          ))}
        </div>
        <div className="flex flex-row items-center gap-2 w-1/4">
          <Slider
            label='Age range'
            classNames={{
              filler: 'bg-red-500',
              thumb: 'bg-red-500'
            }}
            size="sm"
            minValue={18}
            maxValue={100}
            defaultValue={filters.ageRange}
            onChangeEnd={(value) => selectAge(value as number[])} />
        </div>
        <div className="w-1/4">
          <Select
            size="sm"
            fullWidth
            label="Order by"
            variant="bordered"
            aria-label="Order by selector"
            selectedKeys={new Set([filters.orderBy])}
            onSelectionChange={selectOrder}>
            {orderByList.map(item => (
              <SelectItem key={item.value}>{item.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
