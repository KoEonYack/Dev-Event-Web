import classNames from 'classnames/bind';
import style from './Header.module.scss';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FiSearch, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import TextButton from 'component/common/buttons/TextButton';
import SearchModal from 'component/common/modal/SearchModal';

const cn = classNames.bind(style);

function Header() {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [searchModalIsOpen, setSearchModalIsOpen] = useState(false);

  return (
    <header className={cn('header')}>
      <div className={cn('header__inner')}>
        <Link href="/" passHref>
          <div className={cn('header__logo')}>
            <Image src="/logo/logo.png" alt="logo" layout="fill" quality={100}></Image>
          </div>
        </Link>
        <div className={cn('header__buttons')}>
          <TextButton label="행사등록" onClick={() => setLoginModalIsOpen(true)}></TextButton>
          <span className={cn('wrapper')}>
            <TextButton label="로그인" onClick={() => setLoginModalIsOpen(true)}></TextButton>
          </span>
          <div className={cn('header__search')}>
            <button
              className={cn('search-button')}
              onClick={() => {
                setSearchModalIsOpen(true);
              }}
            >
              <FiSearch color="#e8e8e8" size={24} />
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={loginModalIsOpen}>
        <button>구글 로그인</button>
        <button>네이버 로그인</button>
        <button>gitgub 로그인</button>
        <button>카카오톡 로그인</button>
        <button onClick={() => setLoginModalIsOpen(false)}>닫기</button>
      </Modal>
      <SearchModal isOpen={searchModalIsOpen} onClick={() => setSearchModalIsOpen(false)} />
    </header>
  );
}

export default Header;
