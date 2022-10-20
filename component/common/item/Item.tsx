import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Event } from 'model/event';
import classNames from 'classnames/bind';
import style from './Item.module.scss';
import Image from 'next/image';
import FilterTag from '../tag/FilterTag';
import router from 'next/router';
import { MdContentCopy } from 'react-icons/md';
import { DateUtil } from 'lib/utils/dateUtil';
import { useOnClickOutside } from 'lib/hooks/useOnClickOutside';
import * as ga from 'lib/utils/gTag';
import DdayTag from 'component/common/tag/DdayTag';

const cn = classNames.bind(style);

const Item = ({
  data,
  isFavorite,
  isEventDone,
  isEventNew = () => false,
  onClickFavorite,
  onClickShareInMobileSize,
}: {
  data: Event;
  isEventDone: () => boolean;
  isEventNew?: () => boolean;
  isFavorite: () => boolean;
  onClickFavorite?: any;
  onClickShareInMobileSize?: any;
}) => {
  const [isShareModalOpenInDesktop, setShareModalOpenInDesktop] = useState(false);

  const outsideRef = useRef(null);
  const handleClickOutside = () => {
    if (isShareModalOpenInDesktop) {
      setShareModalOpenInDesktop(false);
    }
  };
  useOnClickOutside({ ref: outsideRef, handler: handleClickOutside, mouseEvent: 'click' });

  const checkMobile = () => {
    return navigator.maxTouchPoints; //&& window.innerHeight !== defaultInnerHeight;
  };

  const handleShare = async () => {
    const isMobile = checkMobile();
    if (isMobile) {
      if (navigator.share) {
        try {
          await navigator
            .share({ title: data.title, url: data.event_link })
            .then(() => console.log('Hooray! Your content was shared to tha world'));
        } catch (error) {
          console.log(`공유 중 문제가 발생했습니다!`);
        }
      } else {
        onClickShareInMobileSize(data);
      }
    } else {
      const innerWidth = window.innerWidth;
      if (innerWidth < 768) {
        onClickShareInMobileSize(data);
      } else {
        setShareModalOpenInDesktop(!isShareModalOpenInDesktop);
      }
    }
    ga.event({
      action: 'web_event_공유버튼클릭',
      event_category: 'web_event',
      event_label: '공유',
    });
  };

  const getEventDate = () => {
    let eventDate;
    //당일치기 행사
    if (data.start_date_time && !data.end_date_time) {
      if (data.use_start_date_time_yn === 'N' && data.use_end_date_time_yn === null) {
        eventDate = DateUtil.getDateFormat(data.start_date_time, { hasWeek: true });
      }
      if (data.use_start_date_time_yn === 'Y' && data.use_end_date_time_yn === null) {
        eventDate = DateUtil.getDateTimeFormat(data.start_date_time);
      }

      return eventDate;
    }

    //마감일만 있는 행사
    if (!data.start_date_time && data.end_date_time) {
      if (!data.use_start_date_time_yn) {
        if (data.use_end_date_time_yn === 'N') {
          eventDate = DateUtil.getDateFormat(data.end_date_time, { hasWeek: true });
        }
        if (data.use_end_date_time_yn === 'Y') {
          eventDate = DateUtil.getDateTimeFormat(data.end_date_time);
        }
      }
      return `${eventDate} 까지`;
    }

    //시작, 종료일이 있는 행사
    if (data.start_date_time && data.end_date_time) {
      if (data.use_start_date_time_yn === 'N' && data.use_end_date_time_yn === 'N') {
        eventDate = DateUtil.getPeriodFormat({
          startDate: data.start_date_time,
          endDate: data.end_date_time,
          type: 'date',
        });
      }
      if (data.use_start_date_time_yn === 'Y' && data.use_start_date_time_yn === 'Y') {
        if (DateUtil.getDateFormat(data.start_date_time) === DateUtil.getDateFormat(data.end_date_time)) {
          eventDate = DateUtil.getPeriodFormat({
            startDate: data.start_date_time,
            endDate: data.start_date_time,
            type: 'time',
          });
        } else {
          eventDate = DateUtil.getPeriodFormat({
            startDate: data.start_date_time,
            endDate: data.end_date_time,
            type: 'dateTime',
          });
        }
      }
      return eventDate;
    }

    return '';
  };

  return (
    <div className={cn('item')}>
      <Link href={String(data.event_link)}>
        <a
          onClick={(event: any) => {
            if (event.target.tagName !== 'SPAN' && event.target.tagName !== 'DIV' && event.target.tagName !== 'IMG') {
              event.preventDefault();
            }
            ga.event({
              action: 'web_event_이벤트클릭',
              event_category: 'web_event',
              event_label: '이벤트클릭',
            });
          }}
          target="_blank"
        >
          <div className={cn('item__content')}>
            <div className={cn('item__content__img')}>
              <Image
                className={cn('mask')}
                alt="/default/event_img.png"
                src={
                  data.cover_image_link.includes('brave-people-3.s3.ap-northeast-2.amazonaws.com')
                    ? data.cover_image_link
                    : '/default/event_img.png'
                }
                width={280}
                height={157.5}
              ></Image>
              {isEventDone() ? (
                <div className={cn('item__content__img--isDone')}>
                  <span>종료된 행사입니다</span>
                </div>
              ) : null}
              {isEventNew() ? (
                <div className={cn('item__content__flag', 'new')}>
                  <span>NEW</span>
                </div>
              ) : null}
              {isFavorite() ? (
                <div className={cn('item__content__flag', 'my')}>
                  <span>MY</span>
                </div>
              ) : null}
            </div>
            <div className={cn('item__content__body')}>
              <div>
                <span className={cn('item__content__title')}>{data.title}</span>
                <div className={cn('item__content__desc')}>
                  <span>주최 : {data.organizer}</span>
                  <br className={cn('divider')} />
                  <span>
                    {data.event_time_type === 'RECRUIT' ? '모집' : '일시'} : {getEventDate()}{' '}
                    <DdayTag startDateTime={data.start_date_time} endDateTime={data.end_date_time} />
                  </span>
                </div>
              </div>
              <div className={cn('item__content__bottom')}>
                <div className={cn('tags')}>
                  {data.tags.map((tag) => {
                    return (
                      <FilterTag
                        key={tag.id}
                        label={tag.tag_name}
                        color={tag.tag_color}
                        onClick={(event: any) => {
                          ga.event({
                            action: 'web_event_이벤트태그클릭',
                            event_category: 'web_event',
                            event_label: '검색',
                          });
                          const tag = event.target.innerText.replace(/[\t\s\#]/g, '');
                          router.replace(`/events?tag=${tag}`);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className={cn('item__buttons')}>
        <button className={cn(`like-button`, isFavorite() ? '--selected' : null)} onClick={onClickFavorite} />
        <button className={cn('share-button')} onClick={handleShare} />
        {isShareModalOpenInDesktop ? (
          <div className={cn('share-modal')} ref={outsideRef}>
            {' '}
            <input className={cn('share-modal__link')} value={data.event_link} readOnly></input>
            <button
              className={cn('share-modal__button')}
              onClick={(event) => {
                const copyLink = data.event_link;
                navigator.clipboard
                  .writeText(copyLink)
                  .then(() => {
                    alert('링크가 복사되었습니다');
                  })
                  .catch((err) => {
                    console.log('링크복사 실패', err);
                  });
                ga.event({
                  action: 'web_event_url복사버튼클릭',
                  event_category: 'web_event',
                  event_label: '공유',
                });
              }}
            >
              <MdContentCopy color="#757575" size={20} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Item;
