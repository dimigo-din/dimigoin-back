import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { Timetable, TimetableDocument } from 'src/common/schemas';
import { HttpService } from '@nestjs/axios';
import * as moment from 'moment';

const aliases = {
  '디자인 일반': '디일',
  '통합사회': '사회',
  '미술': '미술',
  '통합과학': '과학',
  '프로그래밍': '플밍',
  '컴퓨터 시스템 일반': '컴일',
  '수학Ⅰ': '수1',
  '수학 I': '수1',
  '수학 II': '수2',
  '수학II': '수2',
  '한국사':'국사',
  '회계 원리': '회계',
  '영어 Ⅰ':'영어',
  '영어Ⅰ': '영어',
  '운동과 건강': '체육',
  '문화 콘텐츠 산업 일반': '문콘',
  '상업 경제': '상경',
  '중국어Ⅰ': '중국어',
  '정보 처리와 관리': '정처',
  '화학I': '화학',
  '화학 I': '화학',
  '물리학Ⅰ': '물리',
  '자료 구조': '자료',
  '컴퓨터 그래픽': '컴그',
  '문학': '문학',
  '성공적인 직업생활': '성직',
  '공업수학': '공수',
  '* 보안 장비 운용': '정보',
  '* 모의해킹': '정보',
  '* 애플리케이션 보안 운영': '정보',
  '정보 통신': '정통',
  '진로활동': '진로',
  '영어': '영어',
  '마케팅과 광고': '마케팅',
  '고전 읽기': '고전',
  '* 2D 애니메이션 레이아웃': '애니',
  '비즈니스 영어': '비영',
  '* 네트워크 보안 운영': '컴보',
  '동아리활동': '동아리',
  '확률과 통계': '확통',
  '자율활동': '자율',
  '토요휴업일': '휴일',
  '* 편곡': '음콘',
  '네트워크': '컴보',
  '영어Ⅱ': '영어',
  '공업 일반': '공일',
  '미적분': '미적',
  '* 네트워크 프로그래밍 구현': '네프',
  '* 네트워크 소프트웨어 개발 방법 수립': '네프',
  '* 탐색적 데이터 분석': '빅데',
  '* 분석용 데이터 탐색': '빅데' ,
  '* 데이터베이스 요구사항 분석': 'DB',
  '* 시스템 보안 운영': '컴보',
  '* 데이터베이스 구현': 'DB',
  '* 펌웨어 구현': '시프',
  '* 프로그램 기획': '방콘',
  '* 전표관리': '회실',
  '* 캐릭터 디자인': '애니',
  '* UI 디자인': '스앱',
  '* 제작준비': '방콘',
  '* 시장환경분석': '전실',
  '* 수출대금결제': '수출',
  '* 수입대금결제': '수출',
  '* 사후관리': '전실',
  '* 빅데이터 수집': '빅데',
  '* 화면 구현': '응화',
  '* UI 테스트': '응화',
  '공업수학의 기초':'공수',
  '* 빅데이터 분석 결과 시각화': '빅데',
  '* IoT 서비스 모형 기획': '사물',
  '* IoT 환경분석': '사물',
  '* 작품 선정': '음콘',
  '* 자금관리':'회실',
  '* 앱프로그래밍':'스앱',
  '* 네트워크보안관리': '구축',
  '* 네트워크유지보수': '구축',
  '* 인터넷 설비 설계': '구축',
  '* 인터넷  설비 설계': '구축',
  '* 네트워크 프로토콜 분석': '네프',
  '* 3D 배경ㆍ소품 제작': '애니',
  '* 3D 캐릭터 제작': '애니',
  '* 색채 디자인': '애니',
  '* 프로그래밍 언어 활용': '응개',
  '* 광고 전략 수립': '광콘',
  '* 음악콘텐츠제작기획': '음콘',
  ' 음악콘텐츠제작기획': '음콘',
  '* 녹음': '음콘',
  '* 제작 기획': '음콘',
  '* 믹스': '음콘',
  '* 제작 준비': '음콘',
  '* 그래픽 제작': '그래픽',
  '인공지능과 미래사회': '인공',
  '* L2⦁L3 스위치 구축': '네구',
  '* SQL활용': '데프',
  '* 무선랜 구축': '네구',
  '* 서버 구축': '네구',
  '* 결산관리': '회계',
  '* 수출마케팅': '수출',
  '* 스톱모션 애니메이션 제작': '애니',
  '* 원가계신': '회계'
};

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable.name)
    private timetableModel: Model<TimetableDocument>,
    private readonly httpService: HttpService,
  ) {}

  async getTimetable(_grade: number, _class: number): Promise<any> {
    return `grade: ${_grade}, class: ${_class}`;
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async updateTimetable(): Promise<any> {
    const weekStart = moment().startOf('week').format('YYYY-MM-DD');
    const weekEnd = moment().endOf('week').format('YYYY-MM-DD');

    const timetable = [];
    for (
      let date = weekStart;
      date < weekEnd;
      date = moment(date).add(1, 'days').format('YYYY-MM-DD')
    ) {
      for (let grade = 1; grade <= 3; grade += 1) {
        for (let klass = 1; klass <= 6; klass += 1) {
          const response = await this.httpService.axiosRef.get(
            'https://open.neis.go.kr/hub/hisTimetable?' +
              `KEY=${'f361e54e141445b794ceb939d1b99def'}&` +
              'Type=json&' +
              'pSize=1000&' +
              'pIndex=1&' +
              'ATPT_OFCDC_SC_CODE=J10&' +
              'SD_SCHUL_CODE=7530560&' +
              `GRADE=${2}&` +
              `CLASS_NM=${6}&` +
              `TI_FROM_YMD=${'20230714'}&` +
              `TI_TO_YMD=${'20230714'}`,
          );

          const { data } = response;
          if ('hisTimetable' in data) {
            const { hisTimetable } = data;
            const { row: result } = hisTimetable[1];

            const dailyTimetable = {
              date,
              grade,
              class: klass,
              sequence: result
                .sort((a: any, b: any) => a.PERIO - b.PERIO)
                .map((r: any) => {
                  const subject = r.ITRT_CNTNT.replace(/\[보강\]\*/i, '');
                  if (subject in aliases) return aliases[subject];
                  return subject;
                }),
            };

            timetable.push(dailyTimetable);
          }
        }
      }
    }

    await this.timetableModel.deleteMany({
      date: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    });

    await this.timetableModel.insertMany(timetable);
    return 'ok';
  }
}
