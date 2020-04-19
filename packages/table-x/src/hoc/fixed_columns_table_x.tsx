import React, { ComponentType, FC } from 'react'
import { TableXColumn, TableXProps } from '../types'

export type FixedColumnsTableXColumn<Original extends object> = TableXColumn<Original> & {
  fixed?: 'left' | 'right'
}

export interface FixedColumnsTableXProps<Original extends object> {
  columns: FixedColumnsTableXColumn<Original>[]
}

function fixedColumnsTableXHOC<
  Original extends object,
  Props extends TableXProps<Original> = TableXProps<Original>
>(Table: ComponentType<Props>) {
  const FixedColumnsTableX: FC<Props & FixedColumnsTableXProps<Original>> = (props) => (
    <Table {...(props as Props)} />
  )
  return FixedColumnsTableX
}

export default fixedColumnsTableXHOC
