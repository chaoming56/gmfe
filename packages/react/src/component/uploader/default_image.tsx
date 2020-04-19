import React, { FC } from 'react'
import classNames from 'classnames'
import { getLocale } from '@gmfe/locales'
import { FlexProps } from '../flex/flex'
import Default from './default'

const DefaultImage: FC<FlexProps> = ({ className, children, ...rest }) => {
  return (
    <Default {...rest} className={classNames('gm-text-12', className)}>
      {children ?? getLocale('+ 加图')}
    </Default>
  )
}

export default DefaultImage
