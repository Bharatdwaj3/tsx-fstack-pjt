import * as Slider from '@radix-ui/react-slider';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CollapsibleList from 'components/CollapsibleList';
import FilterToggle from 'components/FilterToggle';

export function PriceFilter({maxPrice}:{maxPrice: number}) {
  
    const [visible, setVisible]=useState(false);
    const [search, setSearch]=useSearchParams();

    const defaultValues=[
        parseInt(search.get('minPrice') ?? '0'),
        parseInt(search.get('maxPrice') ?? `${maxPrice}`),
    ];
    const [values, setValues]=useState(defaultValues);
    const filterActive=search.get('minPrice')!==null;
    const onApplyFilter=()=>{
        search.set('minPrice',`${values[0]}`);
        search.set('minPrice',`${values[0]}`);
        setSearch(search,{
            replace: true,
        });
    };
  
    return (
    <>
    
    </>
  )
}
