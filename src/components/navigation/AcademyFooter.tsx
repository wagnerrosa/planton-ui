import Image from 'next/image'

export function AcademyFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-[1400px] mx-auto px-4 h-[67px] flex items-center justify-center">
        <Image
          src="/Logo_Planton_01.svg"
          alt="Planton"
          width={115}
          height={28}
          priority={false}
        />
      </div>
    </footer>
  )
}
