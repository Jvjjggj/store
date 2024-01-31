/* eslint-disable jsx-a11y/control-has-associated-label */
// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const constants = {
  initial: 'INITIAL',
  inprogress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: constants.initial,
    productData: {},
    simialrProductDetails: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: constants.inprogress})

    const {match, history} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken === undefined) {
      history.push('/login')
    }

    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    const convert = data => ({
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      price: data.price,
      rating: data.rating,
      similarProducts: data.similar_products,
      title: data.title,
      style: data.style,
      totalReviews: data.total_reviews,
    })

    if (response.ok) {
      const data = await response.json()
      const convertedData = convert(data)

      const similarCaseConvert = convertedData.similarProducts.map(i =>
        convert(i),
      )

      this.setState({
        productData: convertedData,
        apiStatus: constants.success,
        simialrProductDetails: similarCaseConvert,
      })
    } else {
      this.setState({apiStatus: constants.failure})
    }
  }

  redirectTo = () => {
    const {history} = this.props
    history.push('/products')
  }

  viewFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.redirectTo} type="button">
        Continue Shopping
      </button>
    </div>
  )

  viewProgress = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  onIncrement = async () => {
    await this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrement = async () => {
    const {count} = this.state
    if (count > 0) {
      await this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  viewSuccessDetails = () => {
    const {productData, count, simialrProductDetails} = this.state

    return (
      <div>
        <Header />
        <div className="product-indetails">
          <img
            className="product-img"
            src={`${productData.imageUrl}`}
            alt="product"
          />
          <div className="product-container-details">
            <h1>{productData.title}</h1>
            <p>Rs {productData.price}/-</p>
            <div>
              <div>
                <p>{productData.rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>
              <p>{productData.totalReviews} Reviews</p>
            </div>
            <p className="discription">{productData.description}</p>
            <p>
              <span>Available: </span>
              {productData.availability}
            </p>
            <p>
              <span>Brand: </span>
              {productData.brand}
            </p>
            <hr />
            <div className="cart-count-container">
              <button
                data-testid="plus"
                className="plus"
                onClick={this.onIncrement}
                type="button"
              >
                <BsPlusSquare />
              </button>
              <p>{count}</p>
              <button
                data-testid="minus"
                className="plus"
                onClick={this.onDecrement}
                type="button"
              >
                <BsDashSquare />
              </button>
            </div>
            <button type="button">ADD TO CART</button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="unorder-list">
          {simialrProductDetails.map(i => (
            <SimilarProductItem key={i.id} details={i} />
          ))}
        </ul>
      </div>
    )
  }

  viewProductDetaails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constants.failure:
        return this.viewFailure()

      case constants.inprogress:
        return this.viewProgress()

      case constants.success:
        return this.viewSuccessDetails()

      default:
        return null
    }
  }

  render() {
    return <div>{this.viewProductDetaails()}</div>
  }
}

export default ProductItemDetails
