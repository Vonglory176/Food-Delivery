// import React from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'
// import axios from 'axios'
import { toast } from 'react-toastify'
import { useAdmin } from '../../context/adminContext'

const Add = () => {

    const { addFood } = useAdmin()
    const [image, setImage] = useState<string | null>(null)
    const [data, setData] = useState<any>({
        name: '',
        description: '',
        price: '',
        category: 'salad',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Set Image
        if (e.target.name === 'image') setImage(e.target.files[0])

        // Set Other Data
        else setData({ ...data, [e.target.name]: e.target.value })
    }

    const resetForm = () => {
        setData({ name: '', description: '', price: '', category: 'salad' })
        setImage(null)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log(data)

        if (!image) return toast.error('Please upload an image')

        // Create FormData
        const formData = new FormData() // "FormData is specifically designed to handle file uploads" - (Among other things)
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', data.price)
        formData.append('category', data.category)
        formData.append('image', image || "")

        // Send to backend
        await addFood(formData, resetForm)        
    }

    return (
        <div className='add page'>
            <h3>Add Food</h3>

            <hr />

            <form className='flex-col' action="" onSubmit={handleSubmit}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <button type="button" onClick={() => document.getElementById('image')?.click()} aria-label='Upload Image'>
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </button>
                    <input onChange={handleChange} type="file" name='image' id="image" hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Name</p>
                    <input onChange={handleChange} type="text" name='name' value={data.name} placeholder='Enter Product Name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Description</p>
                    <textarea onChange={handleChange} maxLength={200} name="description" rows={6} value={data.description} placeholder='Enter Product Description' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Category</p>
                        <select onChange={handleChange} name="category" value={data.category} required>
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
                        <p>Price</p>
                        <input onChange={handleChange} type="number" name='price' value={data.price} placeholder='Enter Product Price' required />
                    </div>
                </div>

                <button type='submit' className='add-btn' aria-label='Create Food'>Create Food</button>

            </form>
        </div>
    )
}

export default Add
