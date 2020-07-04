import React from 'react';
import styled from 'styled-components';
import { Section, Container, Center, H2, H4 } from '../components/common';
import { Terminal, Code } from './Terminal';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const Title = styled.h1`
  font-weight: 400;
  font-family: 'Montserrat';
  line-height: 5rem;
  font-size: 5rem;
  margin-bottom: 5rem;
`;
const SubTitle = styled.h4`
  font-family: 'Mukta', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 0.4rem;
  margin-top: 3rem;
  margin-bottom: 3.2rem;
`;
const Description = styled.div`
  width: 600px;
  max-width: 100%;
`;

export const QuickStart = () => {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Section id="quick-start">
      <Container>
        <Center>
          <Title className="package--description">Quick Start</Title>
          <Description>
            <SubTitle>
              a) Add library to dependencies in existing project:
            </SubTitle>
            <Terminal className="terminal">
              <Code>npm install {siteConfig.projectName}</Code>
            </Terminal>
            <SubTitle>
              b) Use our boilerplate project to create a new one:
            </SubTitle>
            <Terminal className="terminal">
              <Code>
                git clone https://github.com/eveble/eveble-boilerplate
              </Code>
              <Code>cd eveble-boilerplate</Code>
              <Code>npm run setup</Code>
            </Terminal>
            <SubTitle>
              {' '}
              <a
                className="LinkBasics"
                href={siteConfig.themeConfig.navbar.links[0].to}
              >
                Learn the basics
              </a>{' '}
              or dive deeper and take a{' '}
              <a
                className="LinkBasics"
                href={siteConfig.themeConfig.navbar.links[1].to}
              >
                look at the APIs.
              </a>
            </SubTitle>
          </Description>
        </Center>
      </Container>
    </Section>
  );
};
