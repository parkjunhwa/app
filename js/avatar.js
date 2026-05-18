const AVATAR_URLS = [
  'assets/avatars/avatar-01.jpg',
  'assets/avatars/avatar-02.jpg',
  'assets/avatars/avatar-03.jpg',
  'assets/avatars/avatar-04.jpg',
  'assets/avatars/avatar-05.jpg',
  'assets/avatars/avatar-06.jpg',
  'assets/avatars/avatar-07.jpg',
  'assets/avatars/avatar-08.jpg',
  'assets/avatars/avatar-09.jpg',
  'assets/avatars/avatar-10.jpg',
];

export function personAvatarHtml(index, name, size = 36) {
  const src = AVATAR_URLS[index % AVATAR_URLS.length];
  const alt = name ? `${name} 프로필` : '프로필';
  return `<img class="person-avatar" src="${src}" alt="${alt}" width="${size}" height="${size}" style="width:${size}px;height:${size}px" />`;
}
