export type ViewUser = {
  username: string;
  email?: string;
  id?: string; // APIが返す場合のみ。返さないなら undefined のまま表示を「—」に。
};
