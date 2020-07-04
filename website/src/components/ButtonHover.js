import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

const Circle = styled.span.attrs((props) => ({
  className: props.className,
}))`
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: relative;
  display: block;
  margin: 0;
  width: 3rem;
  height: 3rem;
  background: var(--ifm-button-background-color);
  border-radius: 1.625rem;
`;

const Label = styled.span`
  font-family: 'Mukta', sans-serif;
  font-size: 1rem;
  line-height: 1.8rem;
  transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0.75rem 0;
  margin: 0 0 0 1.85rem;
  color: #282936;
  font-weight: 700;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
`;
const Button = styled.button`
  width: 12rem;
  height: auto;
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  &:hover ${Circle} {
    width: 100%;
  }
  &:hover ${Label} {
    color: #fff;
  }
`;

export const ButtonHover = ({ children, onClick, className }) => {
  return (
    <Button className="button--hover" onClick={onClick}>
      <Circle
        className={classnames('button--circle', className)}
        aria-hidden="true"
      >
        <span className="icon arrow"></span>
      </Circle>
      <Label className="button--label">{children}</Label>
    </Button>
  );
};
