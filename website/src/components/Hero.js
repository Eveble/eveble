import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from 'styled-components';
import { Header, Container, H1, Center } from './common';
import styles from '../pages/styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ButtonHover } from './ButtonHover';
import classnames from 'classnames';

const ActionButton = styled.a`
  ${(props) => {
    switch (props.type) {
      case 'primary':
        return `
          color: var(--ifm-font-color-base-inverse);
          font-family: Mukta;
          font-weight: 700;
          border-color: none;
          border: none;
          &:hover {
            color: var(--ifm-font-color-base-inverse);
            text-decoration: none;
            background: var(--ifm-color-primary-dark);
          }
        `;
      case 'secondary':
        return `
          &::after {
            content: "›";
            margin-left: 5px;
            text-align: center;
          }
        `;
    }
  }}
  padding: 0.7rem 1.1rem;
  font-size: 1em;
`;
const Title = styled(H1)`
  font-size: 3em;
  font-weight: 600;
`;
const Tagline = styled.p`
  font-size: 1.5em;
  text-align: center;
`;
const MainHero = styled.img`
  max-width: 100%;
  text-align: center;
`;

const MainHeader = styled(Header)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const PackageName = styled.div`
  font-family: 'Montserrat';
  color: var(--ifm-color-dark);
  line-height: 1.8rem;
  letter-spacing: 0;
  padding: 1rem 2rem 1rem 1rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-size: 1em;
  position: relative;
`;

function ActionContainer() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <div className="container action--container">
      <div className="row">
        <div className="col col--3 text--center col--offset-3">
          <ActionButton
            className="button button--action button--primary"
            type="primary"
            href={'#quick-start'}
            target="_self"
          >
            QUICK START
          </ActionButton>
        </div>
        <div className="col col--3 text--center">
          <ButtonHover
            className="button--action button--dark"
            onClick={() => {
              window.location.href = siteConfig.themeConfig.navbar.items[0].to;
            }}
            target="_self"
          >
            Learn More
          </ButtonHover>
        </div>
      </div>
    </div>
  );
}

function PackageContainer() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <div className="row package">
      <div className="col col--2 text--right"></div>
      <PackageName
        style={{
          backgroundImage: `url(${useBaseUrl('/img/hero-gradient.png')})`,
        }}
        className="package--name col col--4 text--right"
      >
        <Title>{siteConfig.title.replace('@', '').replace('/', '/\n')}</Title>
      </PackageName>
      <div className="package--information col col--4 text--left">
        <p className="package--description">{siteConfig.tagline}</p>
        <p className="under-development">
          Not yet ready for <span>production</span>.
        </p>
      </div>
      <div className="col col--2 text--right"></div>
    </div>
  );
}

export const Hero = () => {
  return (
    <MainHeader>
      <Container>
        <Center>
          <div className="hero--container">
            <div className="container padding-vert--md">
              <div className="row">
                <div
                  className={classnames('col col--8 col--offset-2 hero--dark')}
                >
                  <MainHero className="hero--main" src={'img/hero.svg'} />
                </div>
              </div>
            </div>
          </div>
          <Container>
            <PackageContainer></PackageContainer>
          </Container>
          <Container>
            <div className={styles.buttons}>
              <ActionContainer />
            </div>
          </Container>
        </Center>
      </Container>
    </MainHeader>
  );
};
