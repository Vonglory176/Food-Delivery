// import React from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'

const Add = () => {

    const [image, setImage] = useState<string | null>(null)
    const [data, setData] = useState<any>(null)

    return (
        <div className='add'>
            <form className='flex-col' action="">
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input type="text" name='name' placeholder='Enter Product Name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea name="description" rows={6} placeholder='Enter Product Description' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
                        <select name="category" required>
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>

                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input type="number" name='price' placeholder='Enter Product Price' required />
                    </div>
                </div>

                <button type='submit' className='add-btn'>CREATE</button>

            </form>
        </div>
    )
}

export default Add
