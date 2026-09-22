// 게스트 선택지는 브라우저의 영구 저장소(localStorage)에 저장하지 않습니다.
// 페이지를 새로고침하거나 다시 열면 메모리가 초기화되어 선택지가 사라집니다.
// 같은 탭에서 선택지 등록 -> 결정하기로 이동하는 동안에는 유지됩니다.

let guestChoices: GuestChoice[] = [];

export type GuestChoice = {
  id: string;
  name: string;
  category: string;
  createdAt: string;
};

export function getGuestChoices(): GuestChoice[] {
  return [...guestChoices];
}

export function saveGuestChoices(choices: GuestChoice[]) {
  guestChoices = [...choices];
}

export function clearGuestChoices() {
  guestChoices = [];
}
