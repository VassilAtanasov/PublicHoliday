function HolidayResult({ title, description, loading }) {
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-gray-600">Loading mock holiday information...</p>
      </div>
    )
  }

  return (
    <>
      <div className="border-l-4 border-blue-600 pl-4">
        <h2 className="text-2xl font-bold leading-tight text-gray-800">{title}</h2>
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="whitespace-pre-line text-gray-700">{description}</p>
      </div>
    </>
  )
}

export default HolidayResult