"use client"
import { redirect, usePathname } from 'next/navigation'

const page = () => {
  const locale = usePathname().split('/')[1]
  return redirect(`${locale}/dashboard`)
}

export default page