import React, {PropTypes, Component} from 'react'
import {formatRPDuration} from 'utils/formatting'
import YesNoButtons from 'src/shared/components/YesNoButtons'
import onClickOutside from 'react-onclickoutside'

class DatabaseRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
    }
    this.handleKeyDown = ::this.handleKeyDown
    this.handleClickOutside = ::this.handleClickOutside
    this.handleStartEdit = ::this.handleStartEdit
    this.handleEndEdit = ::this.handleEndEdit
    this.handleCreate = ::this.handleCreate
    this.handleUpdate = ::this.handleUpdate
    this._getInputValues = ::this._getInputValues
  }

  handleClickOutside() {
    this.handleEndEdit()
  }

  handleStartEdit() {
    this.setState({isEditing: true})
  }

  handleEndEdit() {
    this.setState({isEditing: false})
  }

  handleCreate() {
    const {database, onCreate} = this.props
    onCreate(database, this._getInputValues())
    this.handleEndEdit()
  }

  handleUpdate() {
    const {database, retentionPolicy, onUpdate} = this.props
    onUpdate(database, {...retentionPolicy, ...this._getInputValues()})
    this.handleEndEdit()
  }

  handleKeyDown(e) {
    const {key} = e
    const {retentionPolicy, database, onCancel} = this.props


    if (key === 'Escape') {
      if (retentionPolicy.isNew) {
        onCancel(database, retentionPolicy)
        return
      }

      this.handleEndEdit()
    }

    if (key === 'Enter') {
      if (retentionPolicy.isNew) {
        this.handleCreate()
        return
      }

      this.handleUpdate()
    }
  }

  _getInputValues() {
    return {
      name: this.name.value.trim(),
      duration: this.duration.value.trim(),
      replication: +this.replication.value.trim(),
    }
  }

  render() {
    const {
      retentionPolicy: {name, duration, replication, isDefault, isNew},
      database,
    } = this.props

    if (this.state.isEditing) {
      return (
        <tr>
          <td>
            <div className="admin-table--edit-cell">
              <input
                className="form-control"
                name="name"
                type="text"
                defaultValue={name}
                placeholder="give it a name"
                onKeyDown={(e) => this.handleKeyDown(e, database)}
                autoFocus={true}
                ref={(r) => this.name = r}
              />
            </div>
          </td>
          <td>
            <div className="admin-table--edit-cell">
              <input
                className="form-control"
                name="name"
                type="text"
                defaultValue={duration}
                placeholder="how long should data last"
                onKeyDown={(e) => this.handleKeyDown(e, database)}
                ref={(r) => this.duration = r}
              />
            </div>
          </td>
          <td>
            <div className="admin-table--edit-cell">
              <input
                className="form-control"
                name="name"
                type="number"
                min="1"
                defaultValue={replication || 1}
                placeholder="how many nodes do you have"
                onKeyDown={(e) => this.handleKeyDown(e, database)}
                ref={(r) => this.replication = r}
              />
            </div>
          </td>
          <td className="text-right">
            <YesNoButtons
              onConfirm={isNew ? this.handleCreate : this.handleUpdate}
              onCancel={this.handleEndEdit}
            />
          </td>
        </tr>
      )
    }

    return (
      <tr>
        <td onClick={this.handleStartEdit}>
          {name}
          {isDefault ? <span className="default-source-label">default</span> : null}
        </td>
        <td onClick={this.handleStartEdit}>{formatRPDuration(duration)}</td>
        <td onClick={this.handleStartEdit}>{replication}</td>
        <td className="text-right">
          <button className="btn btn-xs btn-danger admin-table--delete">
            {`Delete ${name}`}
          </button>
        </td>
      </tr>
    )
  }
}

const {
  bool,
  func,
  number,
  shape,
  string,
} = PropTypes

DatabaseRow.propTypes = {
  retentionPolicy: shape({
    name: string,
    duration: string,
    replication: number,
    isDefault: bool,
    isEditing: bool,
  }),
  database: shape(),
  onEdit: func,
  onCancel: func,
  onCreate: func,
  onUpdate: func,
}

export default onClickOutside(DatabaseRow)
