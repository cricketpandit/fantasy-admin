import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    return (
      <React.Fragment>
        <span>Cricket Pandit Fantasy &copy; {new Date().getFullYear()}</span>
        <span className="ml-auto">Powered by Cricket Pandit Fantasy</span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
