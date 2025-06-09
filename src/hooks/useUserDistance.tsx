'use client'

import {useLocation} from '@/context/location-context'
import getDistance from 'geolib/es/getDistance'

import geolib from 'geolib'
import {useCallback, useEffect, useState} from 'react'

async function getCoordinatesFromAddress(address: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
  )

  console.log('🚀 ~ getCoordinatesFromAddress ~ response:', response)

  const data = await response.json()

  console.log('🚀 ~ getCoordinatesFromAddress ~ data:', data)

  return data.results[0].geometry.location // { lat: ..., lng: ... }
}

export const useUserDistanceFromRestaurant = ({
  restaurantAddress,
}: {
  restaurantAddress: string
}) => {
  console.log('🚀 ~ restaurantAddress:', restaurantAddress)

  const [distance, setDistance] = useState(0)
  const {coords} = useLocation()

  const compareCoordinates = useCallback(
    async (coords: any, restaurantAddress: any) => {
      console.log('🚀 ~ restaurantAddress:', restaurantAddress)

      console.log('🚀 ~ coords:', coords)

      const restaurantCoordinates = await getCoordinatesFromAddress(
        restaurantAddress
      )

      console.log('🚀 ~ restaurantCoordinates:', restaurantCoordinates)
      const distanceInMeters = getDistance(
        {lat: coords.latitude, lng: coords.longitude},
        restaurantCoordinates
      )
      const inMiles = distanceInMeters / 1609.344 // Convert meters to miles
      const distance = Math.round(inMiles * 10) / 10 // Round to 1 decimal place

      console.log('🚀 ~ getCoordinatesFromAddress ~ distance:', distance)
      setDistance(distance)
    },
    []
  )

  useEffect(() => {
    if (coords && restaurantAddress) {
      compareCoordinates(coords, restaurantAddress)
    }
  }, [coords, restaurantAddress, compareCoordinates])

  return {distance}
}
