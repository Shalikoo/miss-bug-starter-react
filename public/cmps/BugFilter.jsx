const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

  const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
    console.log(filterByToEdit)
  }, [filterByToEdit])

  function handleChange({ target }) {
    console.log(target)
    const field = target.name
    let value = target.value

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        value = target.checked
        if (target.name === "sortDir") {
          value = target.checked ? -1 : 1
        }
        break

      default:
        break
    }

    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilterBy(filterByToEdit)
  }

  function onTogglePagination() {
    setFilterByToEdit(prevFilter => {
      return {
        ...prevFilter,
        pageIdx: (prevFilter.pageIdx === undefined) ? 0 : undefined
      }
    })
  }

  function onChangePage(diff) {
    if (filterByToEdit.pageIdx === undefined) return
    setFilterByToEdit(prevFilter => {
      let nextPageIdx = prevFilter.pageIdx + diff
      if (nextPageIdx < 0) nextPageIdx = 0
      return { ...prevFilter, pageIdx: nextPageIdx }
    })
  }

  const { txt, minSeverity, sortBy, sortDir } = filterByToEdit
  return (
    <section className="bug-filter">
      <h2>Filter</h2>
      <form onSubmit={onSubmitFilter}>
        <label htmlFor="txt">Text: </label>
        <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

        <label htmlFor="minSeverity">Min Severity: </label>
        <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

        <label htmlFor="label">Label: </label>
        <input value={filterByToEdit.label} onChange={handleChange} type="text" placeholder="By Label" id="label" name="label" />
        
        <section className="sortBy">
        <label htmlFor="txt">Sort by: </label>
        <select name="sortBy" id="sortBy" onChange={handleChange} value={sortBy}>
          <option value="">Sort by</option>
          <option value="title">Title</option>
          <option value="severity">Severity</option>
          <option value="date">Date</option>
        </select>

        <label htmlFor="sortDir">Descending</label>
        <input type="checkbox" name="sortDir" value={sortDir} onChange={handleChange} />
        </section>

      </form>

      <section className="pagination">
        <button onClick={onTogglePagination}>Toggle pagination</button>
        <button onClick={() => { onChangePage(-1) }}>-</button>
        {filterBy.pageIdx + 1 || 'No pagination'}
        <button onClick={() => { onChangePage(1) }}>+</button>
      </section>

    </section>
  )
}