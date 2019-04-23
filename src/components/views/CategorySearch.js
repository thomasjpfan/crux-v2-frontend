import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'
import categories from '../Categories'

class CategorySearch extends Component {
  state = {
    isLoading: false,
    value: '',
    results: []
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultsSelect = (handleSelect) => (e, { result }) => {
    this.resetComponent()
    handleSelect(result)
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(categories, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, results, value } = this.state
    const { handleSelect } = this.props

    return (<div className='field'>
      <label>Tags</label>
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultsSelect(handleSelect)}
        onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
        results={results}
        value={value}
        icon=''>
      </Search>
    </div>)
  }
}

export default CategorySearch
