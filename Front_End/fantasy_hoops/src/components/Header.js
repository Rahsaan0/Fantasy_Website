import propTypes from 'prop-types'
import Button from './Button'

const Header = ({title}) => {
  const onClick = () =>{
    console.log('click')
  }

  return (
    <header>
        <h1>
            {title}
        </h1>
        {/* <Button color = 'blue' text ='Hello' onClick = {onClick}/>
        <Button color = 'orange' text ='Hello2'/>
        <Button color = 'cyan' text ='Hello3'/> */}
    </header>
  )
}

//default prop name
Header.defaultProps = {
  title: 'Fantasy Hoops'
}

//needs to check
Header.prototype = {
  title: propTypes.string
}

// CSS in JS
// const headingStyle = {
//   color: 'red',
//   backgroundColor: 'black',
// }

export default Header
