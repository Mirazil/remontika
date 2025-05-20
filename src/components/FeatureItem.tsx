export default function FeatureItem({
  icon,
  text,
}: {
  icon: string
  text: string
}) {
  return (
    <div className="flex items-center gap-3">
      <img src={icon} alt="" className="h-6 w-6 shrink-0" />
      <span className="text-sm text-[#303030]">{text}</span>
    </div>
  )
}
