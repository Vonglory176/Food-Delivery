import React from 'react'
import { menu_list } from '../../assets/assets'

const ExploreMenu: React.FC<ExploreMenuProps> = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>

        <h1>Explore our menu</h1>
        <p className='explore-menu-text'>Choose from a diverse menu featuring a delectable range of dishes. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
        
        <div className="explore-menu-list">

            {menu_list.map((item, index) => {
                return (
                <button onClick={() => setCategory(prev => prev === item.menu_name ? 'All' : item.menu_name)} key={index} className={`explore-menu-list-item`} aria-label={item.menu_name}> {/*  ${category === item.menu_name ? 'active' : ''} */}
                    <img className={category === item.menu_name ? 'active' : ''} src={item.menu_image} alt={item.menu_name} />
                    {/* <h3>{item.name}</h3> */}
                    <p>{item.menu_name}</p>
                </button>
                )
            })}

        </div>

        <hr />
      
    </div>
  )
}

export default ExploreMenu
