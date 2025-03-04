'use client'
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { FaMale, FaFemale } from "react-icons/fa"
import useFilterStore from "./use-filter-store"
import { useEffect } from "react"
import { Selection } from "@heroui/react"
import usePaginationStore from "./use-pagination-store"
import { useShallow } from "zustand/shallow"

export const useFilters = () => {
  const pathname = usePathname()
  const router = useRouter()

  const orderByList = [
    { label: 'Last active', value: 'updated' },
    { label: 'Newest members', value: 'created' },
  ]

  const genderList = [
    { value: 'male', icon: FaMale },
    { value: 'female', icon: FaFemale }
  ]

  const { filters, setFilters } = useFilterStore()

  const { pageNumber, pageSize } = usePaginationStore(
    useShallow(state => ({
      pageNumber: state.pagination.pageNumber,
      pageSize: state.pagination.pageSize,
    })
    ))

  const { gender, ageRange, orderBy } = filters

  useEffect(() => {
    const searchparams = new URLSearchParams()
    if (gender) searchparams.set('gender', gender.join(','))
    if (ageRange) searchparams.set('ageRange', ageRange.toString())
    if (orderBy) searchparams.set('orderBy', orderBy)
    if (pageSize) searchparams.set('pageSize', pageSize.toString())
    if (pageNumber) searchparams.set('pageNumber', pageNumber.toString())


    router.replace(`${pathname}?${searchparams}`)
  }, [ageRange, gender, orderBy, pathname, router, pageNumber, pageSize])


  const handleAgeSelect = (value: number[]) => {
    setFilters('ageRange', value)
  }

  const handleOrderSelect = (value: Selection) => {
    if (value instanceof Set) {
      setFilters('orderBy', value.values().next().value as string)
    }
  }

  const handleGenderSelect = (value: string) => {
    if (gender.includes(value)) setFilters('gender', gender.filter(g => g !== value))
    else setFilters('gender', [...gender, value])
  }

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    filters
  }
}


