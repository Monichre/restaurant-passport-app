export const StyleWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <div
      id='app'
      className='app-wrapper  top-0 left-0 right-0 z-10 w-screen overflow-x-hidden px-safe py-safe'
    >
      {children}
    </div>
  )
}
