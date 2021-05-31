import React from 'react'

export default ({title, props = {}, compareTo}) => {
  const {photo: photoSrc, ...fields} = props

  return (
    <div className="profile-properties">

      {
        title ? <strong className="profile-properties__title">{title}</strong> : null
      }

      {
        photoSrc ? <img src={photoSrc} className="profile-properties__photo"/> : null
      }

      <dl className="profile-properties-list">
        {
          Object.keys(fields).reduce((list, key) => {
            const isChanged = compareTo && props[key] !== compareTo[key]
            const modifierPostfix = '_changed'
            const dtClass = 'profile-properties-list__title'
            const ddClass = 'profile-properties-list__definition'

            return props[key] || isChanged ? list.concat(
              <dt
                key={key}
                className={isChanged ? `${dtClass} ${dtClass + modifierPostfix}` : dtClass}>
                {key}
              </dt>,
              <dd
                key={props[key]}
                className={isChanged ? `${ddClass} ${ddClass + modifierPostfix}` : ddClass}>
                {props[key] || '-'}
              </dd>
            ) : list
          }, [])
        }
      </dl>
    </div>
  )
}
