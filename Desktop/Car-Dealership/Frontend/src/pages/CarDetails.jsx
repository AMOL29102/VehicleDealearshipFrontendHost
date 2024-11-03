import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';

function CarDetails() {
  const params = useParams();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`https://amol-29102-vehicle-dealership-server-vercel-host.vercel.app/car/${params.id}`);
        setCarData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching car details:', err);
        setError('Error fetching car details');
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto">
      <main className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">{carData.car.carcompany} {carData.car.carname}</h1>
            <Carousel
              showArrows={true}
              autoPlay={true}
              infiniteLoop={true}
              showThumbs={false}
              className="rounded-t-lg"
            >
              {carData.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}  // Correctly use the image URL
                    alt={`Car ${carData.car.carname}`}
                    className="w-full h-auto rounded-t-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-2xl font-bold mb-4">{carData.car.carname} Details</h2>
            <h3 className="text-lg font-semibold mb-2">Car Information</h3>
            <ul>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Car Name:</span>
                <span>{carData.car.carname}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Make:</span>
                <span>{carData.car.carmake}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Company:</span>
                <span>{carData.car.carcompany}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Color:</span>
                <span>{carData.car.carcolor}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Price:</span>
                <span>{carData.car.vehiclesellprice}</span>
              </li>
            </ul>

            {/* Insurance Section */}
            {carData.insurance && <><h3 className="text-lg font-semibold mb-2 mt-4">Insurance Information</h3>
              <ul>
                <li className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Insurance Company:</span>
                  <span>{carData.insurance.insurancecompany}</span>
                </li>
                <li className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Policy Number:</span>
                  <span>{carData.insurance.insurancenumber}</span>
                </li>
                <li className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Policy Tenure:</span>
                  <span>{carData.insurance.policytenure} years</span>
                </li>
              </ul>
            </>
            }
            {/* Owner Section */}
            {/* <h3 className="text-lg font-semibold mb-2 mt-4">Owner Information</h3>
            <ul>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Owner Name:</span>
                <span>{carData.owner.ownername}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Phone Number:</span>
                <span>{carData.owner.ownerphone}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Email:</span>
                <span>{carData.owner.owneremail}</span>
              </li>
              <li className="flex justify-between items-center mb-2">
                <span className="font-semibold">Address:</span>
                <span>{carData.owner.owneraddress}</span>
              </li>
            </ul> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CarDetails;
