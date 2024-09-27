// import React from 'react'
import { useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = () => {

    const [image, setImage] = useState<string | null>(null)
    const [data, setData] = useState<any>({
        name: '',
        description: '',
        price: '',
        category: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Set Image
        if (e.target.name === 'image') setImage(e.target.files[0])

        // Set Other Data
        else setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!image) return toast.error('Please upload an image'

        )
        console.log(data)

        // Create FormData
        const formData = new FormData() // "FormData is specifically designed to handle file uploads" - (Among other things)
        formData.append('name', data.name)
        formData.append('description', data.description)
        formData.append('price', data.price)
        formData.append('category', data.category)
        formData.append('image', image || "")

        // Send to backend
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/food/add`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        console.log(response.data)

        // Reset form
        if (response.data.success) {
            setData({ name: '', description: '', price: '', category: '' })
            setImage(null)
            toast.success(response.data.message)
        }
        else {
            toast.error(response.data.message)
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' action="" onSubmit={handleSubmit}>
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={handleChange} type="file" name='image' id="image" hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input onChange={handleChange} type="text" name='name' value={data.name} placeholder='Enter Product Name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea onChange={handleChange} name="description" rows={6} value={data.description} placeholder='Enter Product Description' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Product category</p>
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
                        <p>Product Price</p>
                        <input onChange={handleChange} type="number" name='price' value={data.price} placeholder='Enter Product Price' required />
                    </div>
                </div>

                <button type='submit' className='add-btn'>CREATE</button>

            </form>
        </div>
    )
}

export default Add
