import React from 'react';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import useSession from 'react-session-hook';
const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {};

const DefaultHeader = (props) => {

  const session = useSession();
  const firstName = session.profile.firstName;

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none" display="md" mobile />
      <AppNavbarBrand>
        <img style={{ height: '37px', width: '201px' }}  className="" src={require('../../assets/img/logo/logo-admin.png') } alt='' />
      </AppNavbarBrand>
      <AppSidebarToggler className="d-md-down-none" display="lg" />
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav className="text-left">
            <i className="fa fa-user fa-lg mr-2"> {firstName}</i><i className="fa fa-chevron-down " />
          </DropdownToggle>
          <DropdownMenu right>
            <Link to="/userprofile" title="User Profile"><DropdownItem className="text-info"> My Profile</DropdownItem></Link>
            {/* <Link to="/change-password" title="Change Password"><DropdownItem className="text-info"> Change Password</DropdownItem></Link> */}
            <a onClick={e => props.onLogout(e)}> <DropdownItem className="text-info">Logout</DropdownItem></a>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  );
};

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default React.memo(DefaultHeader);
