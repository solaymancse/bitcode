import axios from 'axios';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [latestData, setLatestData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleApiConnect = () => {
    setLoading(true);
    axios
      .get("https://raw.githubusercontent.com/Bit-Code-Technologies/mockapi/main/purchase.json")
      .then((res) => {
        setLatestData(res.data || []);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setData(res.data || []))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (latestData.length > 0) {
      setLoading(true);
      axios
        .post("http://localhost:8000/api/products", { products: latestData })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [latestData]);

  const totalData = data?.reduce((accumulator, item) => {
    if (item?.products) {
      accumulator += item.products.total || 0;
    }
    return accumulator;
  }, 0);

  const sumPrice = data?.reduce((accumulator, item) => {
    if (item?.products) {
      accumulator += item.products.product_price || 0;
    }
    return accumulator;
  }, 0);

  const totalQuantity = data?.reduce((accumulator, item) => {
    if (item?.products) {
      accumulator += item.products.purchase_quantity || 0;
    }
    return accumulator;
  }, 0);

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <div className='w-full flex justify-end mb-4'>
        <button onClick={handleApiConnect} className='btn bg-[#6d80ea] p-2 text-white rounded-md shadow hover:bg-[#5a6dbf] transition'>
          Generate Report
        </button>
      </div>
      {loading ? (
        <div className='text-center my-4'>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className='bg-[#6d80ea] text-white'>
              <tr>
                <th className='py-2 px-4 border-b'>Product Name</th>
                <th className='py-2 px-4 border-b'>Customer Name</th>
                <th className='py-2 px-4 border-b'>Quantity</th>
                <th className='py-2 px-4 border-b'>Price</th>
                <th className='py-2 px-4 border-b'>Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, idx) => (
                <tr key={idx} className='hover:bg-gray-100'>
                  <td className='py-2 px-4 border-b'>{item?.products?.product_name}</td>
                  <td className='py-2 px-4 border-b'>{item?.user?.name}</td>
                  <td className='py-2 px-4 border-b'>{item?.products?.purchase_quantity}</td>
                  <td className='py-2 px-4 border-b'>{item?.products?.product_price}</td>
                  <td className='py-2 px-4 border-b'>{item?.products?.total}</td>
                </tr>
              ))}
              <tr className='bg-gray-200 font-bold'>
                <td className='py-2 px-4 border-b'></td>
                <td className='py-2 px-4 border-b'>Gross Total:</td>
                <td className='py-2 px-4 border-b'>{totalQuantity}</td>
                <td className='py-2 px-4 border-b'>{sumPrice}</td>
                <td className='py-2 px-4 border-b'>{totalData}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
