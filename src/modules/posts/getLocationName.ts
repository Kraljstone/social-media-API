import { Client, GeocodeResponse } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function getLocationName(
  longitude: number,
  latitude: number,
): Promise<string> {
  try {
    const response: GeocodeResponse = await client.geocode({
      params: {
        address: `${latitude},${longitude}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000,
    });

    if (response.data.results.length > 0) {
      // Look for relevant address components
      const addressComponents = response.data.results[0].address_components;

      // Find the place name based on the types
      const placeNameComponent = addressComponents.find(
        (component: { types: string[] }) =>
          component.types.includes('locality') ||
          component.types.includes('administrative_area_level_1') ||
          component.types.includes('country'),
      );

      return placeNameComponent
        ? placeNameComponent.long_name
        : 'Unknown location';
    } else {
      return 'Unknown location';
    }
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Error getting location name';
  }
}
