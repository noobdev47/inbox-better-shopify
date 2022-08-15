import API from "./api"

const PlanService = {
  list: () => {
    return API.get(`/packages-details`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  getSinglePaymentClientSecret: (price, customerId) => {
    return API.get(`/stripe/single-payment?price=${price}&customer_id=${customerId}`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  upgradePlan: (price_id, sub_id, packageId) => {
    return API.get(`/stripe-upgrade?subscription_id=${sub_id}&price_id=${price_id === null ? null : price_id}&package_id=${packageId}`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  getSubClientSecret: (price, packageId, customerId, price_id) => {
    return API.get(`/stripe?amount=${price}&package_id=${packageId}&price_id=${price_id === null ? null : price_id}&customer_id=${customerId}`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  sendPaymentDetails: (paymentObj) => {
    return API.get(`/stripe-success?price=${paymentObj.price}&payment_intant_id=${paymentObj.paymentIntent}&currency=${paymentObj.currency}&package_id=${paymentObj.package_id}&customer_id=${paymentObj.customer_id}&subscription_id=${paymentObj.subscription_id}&price_id=${paymentObj.price_id}`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  pauseSubscription: (packageId) => {
    return API.post(`/stripe/pause-subscription?package_id=${packageId}&sub_id=${JSON.parse(localStorage.getItem('user')).stripePayment.subscription_id}`, {})
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  resumeSubscription: (packageId) => {
    return API.post(`/stripe/resume-subscription?package_id=${packageId}&sub_id=${JSON.parse(localStorage.getItem('user')).stripePayment.subscription_id}`, {})
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },
  unsubscribe: (packageId) => {
    return API.delete(`/stripe/unsubscribe?package_id=${packageId}`)
      .then(({ data }) => {
        return data
      })
      .catch((err) => {
        throw err
      })
  },

}

export default PlanService
