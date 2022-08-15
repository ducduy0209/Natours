/* eslint-disable */

import axios from 'axios'
import { showAlert } from './alerts'
const stripe = Stripe(
  'pk_test_51KYsxPCm0Lpr2MHlj2A7yBKAq9sgzqUzybCAFQUXTe3pKvKG3VUX08KTK32jy1NbKtgUVFPPEfMbCQmBOANJR14k007NwPVhhG'
)

export const bookTour = async tourId => {
  try {
    // Get checkout session from API
    const session = await axios(
      `http://localhost:8080/api/v1/bookings/checkout-session/${tourId}`
    )
    // Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err)
    showAlert('Error', err)
  }
}
