const Filter = ({searchName, onChange}) => {
  return(
    <div>
      Search for specific names: <input value={searchName} onChange={onChange} />
    </div>
  )
}

export default Filter;