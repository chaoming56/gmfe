import React, { ChangeEvent, FC, useCallback, useRef, DragEvent } from 'react'
import { is } from '@gm-common/tool'
import classNames from 'classnames'
import { UploaderFile, UploaderProps } from './types'
import Default from './default'
import DefaultImage from './default_image'

interface UploaderFC extends FC<UploaderProps> {
  Default: typeof Default
  DefaultImage: typeof DefaultImage
}

const Uploader: UploaderFC = ({
  onUpload,
  accept,
  multiple,
  className,
  children,
  disabled,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = useCallback((): void => {
    if (disabled) {
      return
    }
    inputRef.current!.click()
  }, [disabled])

  const handleUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement> | DragEvent<HTMLInputElement>) => {
      event.preventDefault()
      const uploadFiles = (event as DragEvent<HTMLInputElement>).dataTransfer
        ? (event as DragEvent<HTMLInputElement>).dataTransfer.files
        : (event as ChangeEvent<HTMLInputElement>).target.files!
      const files: UploaderFile[] = Array.from(uploadFiles).map((file) =>
        Object.assign(file, { preview: window.URL.createObjectURL(file) })
      )
      onUpload(files, event)
    },
    [onUpload]
  )
  return (
    <div
      {...rest}
      className={classNames('gm-uploader', { disabled }, className)}
      onClick={handleClick}
    >
      {children ?? <Default />}
      <input
        ref={inputRef}
        type='file'
        className='gm-uploader-input'
        multiple={!is.weixin() && multiple}
        accept={accept}
        onChange={handleUpload}
      />
    </div>
  )
}

Uploader.Default = Default
Uploader.DefaultImage = DefaultImage

export default Uploader
