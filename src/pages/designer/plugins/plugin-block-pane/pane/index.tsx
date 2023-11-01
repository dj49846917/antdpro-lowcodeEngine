import * as React from 'react';

import { common, event, project } from '@alilc/lowcode-engine';

import { default as BlockCard } from '../card';
import { default as store } from '../store';

import './index.less';
import schemaApi from "@/services/schemaApi";
import { Divider, Input, Spin } from 'antd';
import { SnippetMeta } from "@/pages/designer/plugins/plugin-block-pane/transform";

const { useState, useEffect } = React;

export const BlockPane = () => {
  const [blocks, setBlocks] = useState<SnippetMeta[]>();
  const [searchValue, setSearchValue] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBlocks = async () => {
      setLoading(true)
      const res = await schemaApi.listBlock();
      store.init(res);
      setBlocks(res || []);
      setLoading(false);
    };
    event.on('common:BlockChanged', () => {
      fetchBlocks();
    })
    fetchBlocks();
  }, []);

  const onSearch = (searchValue) => {
    setSearchValue(searchValue);
  }
  const registerAdditive = (shell: HTMLDivElement | null) => {
    if (!shell || shell.dataset.registered) {
      return;
    }

    function getSnippetId(elem: any) {
      if (!elem) {
        return null;
      }
      while (shell !== elem) {
        if (elem.classList.contains('snippet')) {
          return elem.dataset.id;
        }
        elem = elem.parentNode;
      }
      return null;
    }

    const _dragon = common.designerCabin.dragon
    if (!_dragon) {
      return;
    }
    const click = (e: Event) => {};

    shell.addEventListener('click', click);

    _dragon.from(shell, (e: Event) => {
      const doc = project.getCurrentDocument();
      const id = getSnippetId(e.target);
      if (!doc || !id) {
        return false;
      }

      const dragTarget = {
        type: 'nodedata',
        data: store.get(id),
      };

      return dragTarget;
    });

    shell.dataset.registered = 'true';
  };

  return (
    <div
      className='block-pane'
      ref={registerAdditive}
    >
      <div className='search-box'><Input.Search
        placeholder={"搜索区块"}
        onSearch={onSearch}
      /></div>
      <Divider/>
      <Spin spinning={loading}>
        <div className='block-box'>
          {
            blocks?.filter(item => item.title.includes(searchValue || '')).map(item => <BlockCard
              key={item.businessId}
              id={item.businessId}
              title={item.title}
              screenshot={item.screenshot}
            />)
          }
        </div>
      </Spin>
    </div>
  );
}

export default BlockPane;
