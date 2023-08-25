import React from 'react'
import styles from '../styles/Username.module.css';

export default function PageNotFound() {
  return (
    <div className="container mx-auto">

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl font-bold'>Page Not Found</h4>
            <span className='py-10 text-4xl font-bold text-center text-red-500'>
              Error 404
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}
