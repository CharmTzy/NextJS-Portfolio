export default function ExperienceCard() {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-sm text-gray-600">6 YEARS OF</div>
        <div className="text-xl sm:text-2xl font-bold">EXPERIENCE</div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="font-semibold text-base sm:text-lg">Web Developer</div>
            <div className="text-sm text-gray-600">Terraform Labs</div>
          </div>
          <div className="text-sm text-gray-600">2022 - Present</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="font-semibold line-through text-base sm:text-lg">Software Engineer</div>
            <div className="text-sm text-gray-600">Verb Inc.</div>
          </div>
          <div className="text-sm text-gray-600">2019 - 2022</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="font-semibold line-through text-base sm:text-lg">Jr. Front End Engineer</div>
            <div className="text-sm text-gray-600">PNI Digital Media</div>
          </div>
          <div className="text-sm text-gray-600">2019 - 2019</div>
        </div>
      </div>
    </div>
  );
}
