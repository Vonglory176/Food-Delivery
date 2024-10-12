
const Spinner = () => {
  return (
    <div className='spinner'>

      {/* Spinner / "Loading..." */}
      <div className="spinner-loading">
        <div className="spinner-circle"></div>
        <p>Loading...</p>
      </div>

      {/* Subtext */}
      <div className="spinner-message">
        {/* <p>Loading...</p> */}
        <p>(May take a while due to hosting limitations)</p>
      </div>
    </div>
  )
}

export default Spinner
