// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {brand, imageUrl, title, price, rating} = details

  return (
    <li className="list">
      <img className="similarImg" src={imageUrl} alt="similar product" />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div>
        <p>Rs {price}/-</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
