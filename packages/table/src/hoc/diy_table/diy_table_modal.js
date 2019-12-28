import React, { useState } from 'react'
import { Flex, Modal } from '@gmfe/react'
import _ from 'lodash'
import Selector from './selector'
import SortList from './sort_list'
import PropTypes from 'prop-types'

const DiyTableModal = ({ columns, onSave, diyGroupSorting }) => {
  const [diyCols, setDiyCols] = useState(columns)
  const [showCols, setShowCols] = useState(
    _.sortBy(
      columns.filter(o => o.show),
      'diySortNumber'
    )
  )

  const onColsChange = (key, curShow) => {
    const index = _.findIndex(diyCols, o => o.key === key)
    const _diyCols = diyCols.slice()

    const curItem = _diyCols[index]
    curItem.show = !curShow

    setDiyCols(_diyCols)

    // 如果是增加操作
    if (curItem.show) {
      // TODO 如果做排序,就curItem就push到最后
      // 把当前项增加到排序列表中
      setShowCols(
        _.sortBy(
          _diyCols.filter(o => o.show),
          'diySortNumber'
        )
      )
    } else {
      // 把当前项从排序列表去掉
      const _showCols = showCols.slice()
      _.remove(_showCols, item => item.key === key)
      setShowCols(_showCols)
    }
  }

  const onSortColsChange = cols => {
    setShowCols(cols)
  }

  const onColsRemove = key => {
    const _showCols = showCols.slice()
    _.remove(_showCols, o => o.key === key)
    setShowCols(_showCols)

    const index = _.findIndex(diyCols, o => o.key === key)
    const _diyCols = diyCols.slice()
    _diyCols[index].show = false
    setDiyCols(_diyCols)
  }

  const handleSave = () => {
    const columns = diyCols.map(col => {
      // 当前在showCols的索引决定列的排序
      const diySortNumber = _.findIndex(showCols, v => v.key === col.key)
      return {
        ...col,
        show: diySortNumber > -1 // 大于-1才会显示
        // TODO 排序先去掉,后面再做!
        // diySortNumber: (diySortNumber + 1) * 100 // 从100开始,100, 200, 300, ...如此类推
      }
    })

    onSave(columns)
    Modal.hide()
  }

  return (
    <div className='gm-react-table-diy-modal'>
      <Flex>
        <div className='gm-react-table-diy-modal-selector'>
          <div className='gm-border-bottom gm-react-table-diy-modal-title'>
            可选字段
          </div>
          <Selector
            diyGroupSorting={diyGroupSorting}
            cols={diyCols}
            onColsChange={onColsChange}
          />
        </div>
        <div className='gm-react-table-diy-modal-sort-list'>
          <div className='gm-border-bottom gm-react-table-diy-modal-title'>
            当前选定的字段
          </div>
          <SortList
            cols={showCols}
            onColsChange={onSortColsChange}
            onColsRemove={onColsRemove}
          />
        </div>
      </Flex>
      <Flex justifyEnd className='gm-padding-10'>
        <button className='btn btn-default btn-sm' onClick={() => Modal.hide()}>
          取消
        </button>
        <div className='gm-gap-10' />
        <button className='btn btn-primary btn-sm' onClick={handleSave}>
          保存
        </button>
      </Flex>
    </div>
  )
}

DiyTableModal.propTypes = {
  columns: PropTypes.array.isRequired,
  diyGroupSorting: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired
}

export default DiyTableModal
