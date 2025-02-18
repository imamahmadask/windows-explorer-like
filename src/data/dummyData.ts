import type { Folder } from '../types/folder'

export const dummyFolderStructure: Folder[] = [
  {
    id: 1,
    name: 'Root',
    subfolders: [
      {
        id: 2,
        name: 'Documents',
        subfolders: [
          {
            id: 5,
            name: 'Work',
            subfolders: [
              {
                id: 11,
                name: 'Projects',
                subfolders: [
                  { id: 12, name: 'Project A' },
                  { id: 13, name: 'Project B' },
                ],
              },
              { id: 14, name: 'Reports' },
            ],
          },
          {
            id: 6,
            name: 'Personal',
            subfolders: [
              { id: 15, name: 'Finance' },
              { id: 16, name: 'Health' },
            ],
          },
        ],
      },
      {
        id: 3,
        name: 'Pictures',
        subfolders: [
          {
            id: 7,
            name: 'Vacation',
            subfolders: [
              { id: 17, name: '2022' },
              { id: 18, name: '2023' },
            ],
          },
          { id: 8, name: 'Family' },
        ],
      },
      {
        id: 4,
        name: 'Music',
        subfolders: [
          {
            id: 9,
            name: 'Rock',
            subfolders: [
              { id: 19, name: 'Classic Rock' },
              { id: 20, name: 'Modern Rock' },
            ],
          },
          { id: 10, name: 'Jazz' },
        ],
      },
    ],
  },
]
