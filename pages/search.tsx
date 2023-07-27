import React, { useEffect, useState, useContext } from 'react';
import Layout from 'components/layout';
import type { ReactElement } from 'react';
import classNames from 'classnames/bind';
import style from 'styles/Home.module.scss';
import { GetServerSideProps } from 'next';
import cookie from 'cookie';
import { AuthContext } from 'context/auth';
import LoginModal from 'components/common/modal/LoginModal';
import Banner from 'components/common/banner/banner';
import FilteredEventList from 'components/events/FilteredEventList';
import { EventResponse } from 'model/event';
import Letter from 'components/features/letter/Letter';
import { EventContext } from 'context/event';
import MonthlyEventList from 'components/events/MonthlyEventList';
import { getCurrentDate } from 'lib/utils/dateUtil';

const cn = classNames.bind(style);

type Props = {
  isLoggedIn: boolean;
  fallbackData: EventResponse[];
}

const Search = ({ isLoggedIn, fallbackData }: Props) => {
  const authContext = React.useContext(AuthContext);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const { date } = useContext(EventContext);

  useEffect(() => {
    console.log(date)
    if (isLoggedIn) {
      authContext.login();
    } else {
      authContext.logout();
    }
  }, [isLoggedIn]);

  return (
    <>
      <Banner />
      <section className={cn('section')}>
        {(date === undefined || date === getCurrentDate())
          ? (<FilteredEventList
              fallbackData={fallbackData}
            />
          ) : (
            <MonthlyEventList
              fallbackData={fallbackData}
              date={date}
            />
          ) 
        }
      </section>
      <Letter />
      <LoginModal isOpen={loginModalIsOpen} onClose={() => setLoginModalIsOpen(false)}></LoginModal>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie || '';
  const res = await fetch(`${process.env.BASE_SERVER_URL}/front/v2/events/current`);
  const events = await res.json();

  if (cookies) {
    const parsedCookies = cookie.parse(cookies);
    const access_token = parsedCookies.access_token;
    const refrest_token = parsedCookies.refresh_token;

    if (access_token && refrest_token) {
      return {
        props: {
          isLoggedIn: true,
          fallbackData: events
        },
      };
    }
  }

  return {
    props: {
      isLoggedIn: false,
      fallbackData: events,
    },
  };
};

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Search;
