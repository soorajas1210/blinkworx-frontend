
import { IoMdCart } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const Navbar = () => {
    const navigate = useNavigate()
    const { cartCount } = useStore()
    return (
        <div className='h-16 bg-amber-400 flex justify-between items-center lg:px-20 sm:px-10 px-5 text-gray-700 '>

            <img src={'/logo/logo.png'} alt='Logo' className='w-auto h-6 sm:h-8 md:h-10 cursor-pointer' onClick={() => navigate('/')} />

            <div className='relative'>
                {cartCount > 0 && <div className='absolute -top-2 -right-2 font-semibold  bg-red-500 rounded-full text-white  text-xs w-5 h-5 flex items-center justify-center'>{cartCount}</div>}
                <IoMdCart className='font-semibold text-3xl hover:bg-amber-500 hover:scale-105 duration-300 ease-in-out p-1 rounded-md cursor-pointer' />
            </div>
        </div>
    )
}

export default Navbar
