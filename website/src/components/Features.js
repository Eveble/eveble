import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../pages/styles.module.css';
import classnames from 'classnames';

const features = [
  {
    title: <>Lorem Ipsum</>,
    imageUrl: 'img/logo-monochrome.svg',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        semper faucibus tincidunt. Cras faucibus, leo id euismod euismod, justo
        purus convallis ex{' '}
        <a href="https://www.google.com">JavaScript based version</a>.
      </>
    ),
  },
  {
    title: <>Open Source</>,
    imageUrl: 'img/logo-monochrome.svg',
    description: (
      <>
        Eveble is an open source project maintained by an active community of
        contributors.
      </>
    ),
  },
  {
    title: <> Integer rhoncus </>,
    imageUrl: 'img/logo-monochrome.svg',
    description: (
      <>
        nteger rhoncus mollis nulla, non lobortis diam. Donec et quam dui. Duis
        tincidunt sed augue sed dictum. Proin lacus erat, feugiat et sodales
        eget, auctor et dui. Cras vitae arcu eget purus semper dapibus sit amet
        maximus sem..
      </>
    ),
  },
];

export const Features = () => {
  return (
    <section className={`features styles.features`}>
      <div className="container">
        <div className="row">
          {features.map(({ imageUrl, title, description }, idx) => (
            <div key={idx} className={classnames('col col--4', styles.feature)}>
              {imageUrl && (
                <div className="text--center">
                  <img
                    className={styles.featureImage}
                    src={useBaseUrl(imageUrl)}
                    alt={title}
                  />
                </div>
              )}
              <h3 className="text--center">{title}</h3>
              <p className="text--center">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
