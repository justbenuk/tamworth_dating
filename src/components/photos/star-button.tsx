import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import { PiSpinner } from 'react-icons/pi'

type StarButtonProps = {
  selected: boolean
  loading: boolean
}
export default function StarButton({ selected, loading }: StarButtonProps) {
  return (
    <div className="relative hover:opacity-80 transition cursor-pointer">
      {!loading ? (
        <>
          <AiOutlineStar size={32} className="fill-white absolute -top-[2px] -right-[2px]" />
          <AiFillStar size={32} className={selected ? 'fill-yellow-200' : 'fill-neutral-500/70'} />
        </>
      ) : (
        <PiSpinner size={32} className="fill-white animate-spin" />
      )}</div >
  )
}
